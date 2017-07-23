import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import Pet from './Pet';

@observer
class PetInfo extends Component {
    render({category, store}) {
        return (
        <div class="ui fluid container">
            <br/>
            <div class="ui horizontal divider header">
              <h4>{category}</h4>
            </div>
            <table class="ui very basic collapsing celled table">
                <thead>
                    <tr>
                        <th>Pet Need/Count</th>
                        <th>User(s) Has</th>
                    </tr>
                </thead>
                <tbody>
                    {[...store.pets].filter(([id,pet]) => pet.basetype === category)
                                    .map(([id,pet]) =>
                    <tr>
                        <td><Pet pet={pet}/></td>
                        <td>{pet.users.map(user => user.data.profile.name).join(',')}</td>
                    </tr>   
                    )}
                </tbody>
            </table>
        </div>
        );
                    /*                                 
                                     => pet.users)
                                    .filter(users => users.length >= 1)
                                    .map(user => user[0] === undefined ? '' :

                    )}
                    */
    }
}


export default PetInfo;