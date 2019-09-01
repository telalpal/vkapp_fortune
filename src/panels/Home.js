import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Button, Div, PanelHeader, FormLayout, Select, Footer } from '@vkontakte/vkui';

import './../index.css';

const Home = ({ id, go, availableDays, setDay, selectedDay, dayDescription }) => (
    <Panel id={id}>
        <PanelHeader>Лунная Фортуна</PanelHeader>
        <FormLayout>
            <Select 
                onChange={({target}) => setDay(target.value)}
                placeholder='Выберите лунный день'
                value={selectedDay}
            >
                {
                    availableDays.map((day) => {
                        return (
                            <option value={day} key={day}>{`Лунный день ${day}`}</option>
                        )
                    })
                })
            </Select>
        </FormLayout>
        <Div>
            <Button size="xl" level="commerce" onClick={go} data-to="wheel" disabled={selectedDay ? false : true}>
                Получить предсказание
            </Button>
        </Div>
        <Footer className={'Description'}>{dayDescription} </Footer>
    </Panel>
);

Home.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
    selectedDay: PropTypes.string.isRequired,
    setDay: PropTypes.func.isRequired,
    availableDays: PropTypes.arrayOf(PropTypes.string).isRequired,
    dayDescription: PropTypes.string.isRequired,
};

export default Home;
