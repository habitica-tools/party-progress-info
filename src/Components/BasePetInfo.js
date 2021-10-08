import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import Pet from './Pet';

@observer
class BasePetInfo extends Component {
    render({category, store}) {
        return (
        <div class="ui fluid">
            <br/>
            <div class="ui horizontal divider header">
              <h4>{category}</h4>
            </div>
            <table class="ui very basic collapsing celled table">
                <thead>
                    <tr>
                        <th>Pet Need/Count</th>
                        <th>User(s) With Pet</th>
                        <th>User(s) With Mount</th>
                    </tr>
                </thead>
                <tbody>
                    {[...store.basepets].filter(([id,pet]) => pet.basetype === category)
                                    .map(([id,pet]) =>
                    <tr>
                        <td><Pet pet={pet}/></td>
                        <td>{pet.usersWithPet.map(user => user.data.profile.name).join(', ')}</td>
                        <td>{pet.usersWithMount.map(user => user.data.profile.name).join(', ')}</td>
                    </tr>   
                    )}
                </tbody>
            </table>
        </div>
        );
    }
}


export default BasePetInfo;