import React from 'react';
import { View, ScreenSpinner } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Wheel from './panels/Wheel';
import defaultData from './data';


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activePanel: 'home',
            modal: null,
            day: '',
            allDaysData: {},
            appDescription: '',
            popout: null,
        };
    }

    componentDidMount() {
        this.setState({popout: <ScreenSpinner/>});

        fetch('https://gist.githubusercontent.com/ntelnova/dab0cb49cf93852da85b0c4a48b2a1c0/raw/data.json', {
            method: 'GET',
            mode: 'cors',
            cache: 'no-store',
        })
            .then((response) => {
                return response.json();
            })
            .then((gistData) => {
                this.setState({allDaysData: gistData['days'], appDescription: gistData['appDescription']})
            })
            .catch((error) => {
                console.error('Gist call error:', error);
                console.warn('Using static data (probably obsolete.)')
                this.setState({allDaysData: defaultData['days'], appDescription: defaultData['appDescription']})
            })
            .finally(() => {
                this.setState({popout: null})
            });
    }

    go = (e) => {
        this.setState({ activePanel: e.currentTarget.dataset.to })
    };

    setModal = (modal) => {
        this.setState({modal})
    }

    setDay = (day) => {
        this.setState({day})
    }

    render() {
        const {allDaysData, day, popout, appDescription} = this.state;

        const availableDays = Object.keys(allDaysData);
        const dayDescription = day ? allDaysData[day].description : appDescription;
        const choicesData = day ? allDaysData[day].choices : [];
        return (
            <View activePanel={this.state.activePanel} modal={this.state.modal} popout={popout}>
                <Home
                    id="home"
                    go={this.go}
                    availableDays={availableDays}
                    setDay={this.setDay}
                    selectedDay={day}
                    dayDescription={dayDescription}
                />
                <Wheel
                    id="wheel"
                    go={this.go}
                    setModal={this.setModal}
                    data={choicesData}
                />
            </View>
        );
    }
}

export default App;
