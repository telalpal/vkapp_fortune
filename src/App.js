import React from 'react';
import { View } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Wheel from './panels/Wheel';
import data from './data';
import {appDescription} from './constants';


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activePanel: 'home',
            modal: null,
            day: '',
        };
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
        const availableDays = Object.keys(data);
        const day = this.state.day;
        const dayDescription = day ? data[day].description : appDescription;
        const choisesData = day ? data[day].choises : [];
        return (
            <View activePanel={this.state.activePanel} modal={this.state.modal}>
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
                    data={choisesData}
                />
            </View>
        );
    }
}

export default App;
