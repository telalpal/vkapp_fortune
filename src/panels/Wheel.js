import React from 'react';
import PropTypes from 'prop-types';
import {
    Panel,
    PanelHeader,
    HeaderButton,
    platform,
    IOS,
    Button,
    Div,
    ModalRoot,
    ModalCard
} from '@vkontakte/vkui';
import './Wheel.css';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import { wheelFactory } from '../wheelUtils';

const osname = platform();


class Wheel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            spinEnabled: true,
        };
        this.wheel = null;
    }

    componentDidMount() {
        const mount = document.querySelector('#wheelContainer');
        this.wheel = wheelFactory(mount);
        this.wheel.init({
            width: Math.min(window.innerWidth, window.innerHeight),
            height: Math.min(window.innerWidth, window.innerHeight),
            onWheelStop: this.handleWheelStop,
        });

        const words = this.props.data.map(choice => choice.caption);
        this.wheel.setWords(words);
        this.wheel.drawWheel();
    }

    handleSpin = () => {
        this.setState({ spinEnabled: false });
        this.wheel.spin(Math.random());
        // this.wheel.spin(2.99);
    }

    handleWheelStop = (word) => {
        const bonus = this.props.data.find(el => el.caption === word);

        const modal = (
            <ModalRoot activeModal="results_modal_card">
                <ModalCard
                    id="results_modal_card"
                    onClose={this.closeDetailsModal}
                    // icon={<Icon56MoneyTransferOutline />}
                    title={`Тебе выпало ${word}`}
                    caption={bonus.text}
                    actions={[{
                        title: 'Ясно понятно',
                        type: 'primary',
                        action: this.closeDetailsModal,
                    }]}
                >
                </ModalCard>
            </ModalRoot>
        );
        this.props.setModal(modal)
    }

    closeDetailsModal = () => {
        this.props.setModal(null)
        this.setState({ spinEnabled: true })
    }

    render() {
        return (
            <Panel id={this.props.id}>
                <PanelHeader
                    left={<HeaderButton onClick={this.props.go} data-to="home">
                        {osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
                    </HeaderButton>}
                >
                    Лунная Фортуна
                        </PanelHeader>
                <div id="wheelContainer" />
                <Div>
                    <Button level="commerce" size="xl" onClick={this.handleSpin} disabled={!this.state.spinEnabled}>Крутить!</Button>
                </Div>
            </Panel>
        )
    }
}

Wheel.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
    setModal: PropTypes.func.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
        caption: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
    })).isRequired,
};

export default Wheel;
