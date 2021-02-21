import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import UserStore from './stores/UserStore'
import SubmitButton from './SubmitButton'
import 'bootstrap/dist/css/bootstrap.min.css'
import { MDBBtn, MDBBtnGroup } from "mdbreact";

var usernames = [];

function onRowSelect(row, isSelected) {
    var row_user = row['username'];
    if (isSelected) {
        usernames.push(row_user);
    } else {
        for (let i = 0; i < usernames.length; i++) {
            if (usernames[i] === row_user) {
                usernames.splice(i, 1);
                break;
            }
        }
    }
}

function onSelectAll(isSelected, rows) {
    if (isSelected) {
        for (let i = 0; i < rows.length; i++) {
            usernames.push(rows[i].username);
        }
    } else {
        usernames = []
    }
}
  
class LoggedInForm extends React.Component {
    
    constructor() {
        super();
        this.tableRef = React.createRef();

    }
    async doLogout() {
        try {
            let res = await fetch('/logout', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                }
            });

            let result = await res.json();

            if (result && result.success) {
                UserStore.isLoggedIn = false;
                UserStore.username = ' ';
            }
        }

        catch(e) {
            console.log(e);
        }

    }

    async doDelete() {
      
        try {
            let res = await fetch('/delete', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.props.user,
                    data: usernames
                })
            });

            let result = await res.json();

            if (result && result.success) {
                if (result.selfKill === true) {
                    UserStore.isLoggedIn = false;
                }

                UserStore.data = result.data;
            }

            else {
                alert(result.msg);
            }
            
        }

      catch(e) {
          console.log(e);
      }

    }

    async doBlock() {
      
        try {
            let res = await fetch('/block', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.props.user,
                    data: usernames
                })
            });

            let result = await res.json();

            if (result && result.success) {
                if (result.selfKill === true) {
                    UserStore.isLoggedIn = false;
                }
                
                UserStore.data = result.data;
            }

            else {
                alert(result.msg);
            }
        }

      catch(e) {
          console.log(e);
      }

    }

    async doUnblock() {
      
        try {
            let res = await fetch('/unblock', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    data: usernames
                })
            });

            let result = await res.json();

            if (result && result.success) {
                UserStore.data = result.data;
            }

            else {
                alert(result.msg);
            }
        }

      catch(e) {
          console.log(e);
      }

    }

    render() {
        const columns = [{
            dataField: 'id',
            text: 'ID'
          },{
            dataField: 'username',
            text: 'Name'
          },{
            dataField: 'email',
            text: 'Email'
          },{
            dataField: 'register_date',
            text: 'Date of registration'
          },{
            dataField: 'login_date',
            text: 'Date of last login'  
          },{
            dataField: 'status',
            text: 'Status'  
          }];

        const selectRow = {
            mode: 'checkbox',
            clickToSelect: true,
            onSelect: onRowSelect,
            onSelectAll: onSelectAll
        };
        
        return (
            <div className="h-100 w-100 d-flex flex-column justify-content-center align-items-center m-0">
                
                Welcome, {this.props.user}
                
                <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                  <MDBBtnGroup className="mr-2 pb-2 pt-2">
                    <MDBBtn className="btn btn-primary" onClick={ () => this.doBlock() }>Block</MDBBtn>
                    <MDBBtn className="btn btn-primary" onClick={ () => this.doUnblock() }>Unblock</MDBBtn>
                    <MDBBtn className="btn btn-danger" onClick={ () => this.doDelete() }>Delete</MDBBtn>
                  </MDBBtnGroup>
                </div> 

                <BootstrapTable className="h-100 w-100 d-flex flex-column justify-content-center align-items-center m-0 pb-2"
                 keyField='id' data={ this.props.data } columns={ columns } selectRow={selectRow} />
                <SubmitButton
                    text={'Log out'}
                    disabled={false}
                    onClick={ () => this.doLogout() }
                    class='btn btn-primary btn-lg'
                />

            </div>
        )
    }
}

export default LoggedInForm;