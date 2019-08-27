import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Button, Div, PanelHeader, FormLayout, Select, Footer } from '@vkontakte/vkui';


const Home = ({ id, go, availableDays, setDay, selectedDay, dayDescription }) => (
    <Panel id={id}>
        <PanelHeader>Лунная Фортуна</PanelHeader>
        <FormLayout>
            <Select 
                top="Выберите лунный день"
                defaultValue={selectedDay}
                onChange={({target}) => setDay(target.value)}
            >
                {
                    availableDays.map((day) => {
                        return (<option value={day} key={day}>{`Лунный день ${day}`}</option>)
                    })
                })
            </Select>
        </FormLayout>
        <Div>
            <Button size="xl" level="2" onClick={go} data-to="wheel">
                Нажми
            </Button>
        </Div>
        <Footer>{dayDescription}</Footer>
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
