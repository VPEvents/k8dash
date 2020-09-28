import './logs.scss';
import _ from 'lodash';
import React from 'react';
import Switch from 'react-switch';
import Select from 'react-select';
import Ansi from 'ansi-to-react';
import Base from '../components/base';
import InputFilter from '../components/inputFilter';
import Loading from '../components/loading';
import api from '../services/api';
import { Pod } from '../utils/types';

type Props = {
    namespace: string;
    name: string;
}

type State = {
    showPrevious: boolean;
    items: string[];
    item?: Pod;
    containers?: string[];
    container?: string;
    initContainers?: string[];
    filter?: string;
}

export default class Logs extends Base<Props, State> {
    private debouncedSetState: Function;

    state: State = {
        showPrevious: false,
        items: [],
    };

    constructor(props: Props) {
        super(props);

        // From the lodash docs: "If leading and trailing options are true, func is invoked
        // on the trailing edge of the timeout only if the debounced function is invoked more
        // than once during the wait timeout."
        const options = {leading: true, trailing: true, maxWait: 1000};
        this.debouncedSetState = _.debounce(this.setState.bind(this), 100, options);
    }

    componentDidMount() {
        const {namespace, name} = this.props;

        this.registerApi({
            item: api.pod.get(namespace, name, x => this.onPod(x)),
        });
    }

    onPod(pod: Pod) {
        const containers = pod.spec.containers.map(x => x.name);
        let initContainers: string[] = [];

        if (pod.spec.initContainers) {
            initContainers = pod.spec.initContainers.map(x => x.name);
        }


        this.setState({containers, initContainers });
        this.setContainer(containers[0]);
    }

    setContainer(container: string) {
        if (this.state.container === container) return;
        this.startLogsStream(container, this.state.showPrevious);
    }

    setShowPrevious(showPrevious: boolean) {
        if (this.state.showPrevious === showPrevious) return;
        this.startLogsStream(this.state.container, showPrevious);
    }

    startLogsStream(container?: string, showPrevious: boolean = false) {
        if (!container) return;

        this.setState({container, showPrevious, items: []});

        const {namespace, name} = this.props;
        this.registerApi({
            items: api.logs(namespace, name, container, 1000, showPrevious, items => this.debouncedSetState({items})), // eslint-disable-line max-len
        });
    }

    render() {
        const {namespace, name} = this.props;
        const {items, container, containers = [], initContainers = [], filter = '', showPrevious = false} = this.state;

        const lowercaseFilter = filter.toLowerCase();
        const filteredLogs = items.filter(x => x.toLowerCase().includes(lowercaseFilter));

        const containerOptions = containers.map(x => ({ value: x, label: x }));
        const initContainerOptions = initContainers.map(x => ({ value: x, label: x }));

        const options = [{
            label: 'Containers',
            options: containerOptions
        }, {
            label: 'Init Containers',
            options: initContainerOptions
        }];

        const selected = [...containerOptions, ...initContainerOptions].find((x) => x.value == container);

        return (
            <div id='content'>
                <div id='header'>
                    <span className='header_label'>{['Pod Logs', namespace, name].join(' • ')}</span>

                    <div className='select_namespace'>
                        <Select
                            className="react-select"
                            classNamePrefix="react-select"
                            value={selected}
                            options={options}
                            // @ts-ignore
                            onChange={x => this.setContainer(x.value)}
                        />
                    </div>

                    <label className='logs_showPrevious'>
                        <Switch
                            checked={showPrevious}
                            onChange={x => this.setShowPrevious(x)}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            width={20}
                            height={10}
                        />
                        <div className='logs_showPreviousLabel'>Previous</div>
                    </label>

                    <InputFilter
                        filter={filter}
                        onChange={x => this.setState({filter: x})}
                    />
                </div>

                <div className='contentPanel'>
                    {!items ? <Loading /> : (
                        <pre>
                            {filteredLogs.map((x, i) => (
                                <Ansi key={i} linkify={false}>{x}</Ansi>
                            ))}
                        </pre>
                    )}
                </div>
            </div>
        );
    }
}
