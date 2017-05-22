import React from 'react';
import ContactInfo from './ContactInfo';
import ContactDetails from './ContactDetails';
import ContactCreate from './ContactCreate';
import update from 'react-addons-update';

export default class Contact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            /**
                react한 로더는
                component가 수정되서 reloading 될 때 state를 파괴하지 않고 유지 시킨다.
                부작용으로는 reloading될 때 constructor 를 시작하지 않는다. constructor가 수정이 되면 F5(새로고침) 눌러서 수정해준다.
            **/
            selectedKey: -1,
            keyword: '',
            contactData: [
                {
                    name: 'Abet',
                    phone: '010-0000-0001'
                }, {
                    name: 'Bbet',
                    phone: '010-0000-0002'
                }, {
                    name: 'Cbet',
                    phone: '010-0000-0003'
                }, {
                    name: 'Dbet',
                    phone: '010-0000-0004'
                }
            ]
        };
        this.handleChange = this.handleChange.bind(this);/** 함수에서 this가 뭔줄 모르기 때문에 this를 binding해준다. **/
        this.handleClick = this.handleClick.bind(this);

        this.handleCreate = this.handleCreate.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    componentWillMount() {
        const contactData = localStorage.contactData;
        console.log("componentWillMount");
        if(contactData) {
            this.setState({
                contactData : JSON.parse(contactData)
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("conponentDidUpdate");
        if(JSON.stringify(prevState.contactData) != JSON.stringify(this.state.contactData)) {
            localStorage.contactData = JSON.stringify(this.state.contactData);
        }
    }

    handleClick(key) {
        this.setState({
            selectedKey: key
        });
        console.log("A");
        console.log(key, 'is selected');
    }

    handleChange(e) {
        this.setState({keyword: e.target.value});
    }

    handleCreate(contact) {
        this.setState({
            contactData : update(this.state.contactData, {$push: [contact]})
        });
    }

    handleRemove() {
        if (this.state.selectedKey < 0) {
            return;
        }

        this.setState({
            contactData: update(this.state.contactData,
                {$splice:[[this.state.selectedKey, 1]]} /** selectedKey부터 첫번째값을 삭제하겠다. **/
            ),
            selectedKey : -1    /** 무효화 한다는 의미이다. **/
        });
    }

    handleEdit(name, phone) {
        this.setState({
            contactData:update(this.state.contactData,
                {
                    [this.state.selectedKey]: {
                        name: {$set: name},
                        phone: {$set:phone}
                    }
                }
            )
        });
    }

    render() {
        const mapToComponent = (data) => {
            data.sort((a, b) => {
                return a.name > b.name;/** 알파벳 순서로 정렬 **/
            });
            data = data.filter((contact) => {
                return contact.name.toLowerCase().indexOf(this.state.keyword.toLowerCase()) > -1;/** 검색로직 **/
            })

            return data.map((contact, i) => {
                return (<ContactInfo
                    contact={contact}
                    key={i}
                    onClick={() => this.handleClick(i)}/>);
                    /**
                        event는 component에는 적용이 안되고 native dom(div, h1, button) 에만 적용된다
                    **/
            });
        };

        return (
            <div>
                <h1>Contacts</h1>
                <input name="keyword" placeholder="Search" value={this.state.keyword} onChange={this.handleChange}/>
                <div>{mapToComponent(this.state.contactData)}</div>
                <ContactDetails
                    isSelected={this.state.selectedKey != -1}
                    contact = {this.state.contactData[this.state.selectedKey]}
                    onRemove = {this.handleRemove}
                    onEdit = {this.handleEdit}
                />
                <ContactCreate
                    onCreate = {this.handleCreate}
                />
            </div>
        );
    }
}
