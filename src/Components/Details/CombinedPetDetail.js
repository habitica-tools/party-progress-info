import { Component } from 'preact';
import { observer } from 'mobx-react';

import Mount from '../Items/Mount';
import Pet from '../Items/Pet';

@observer
class CombinedPetDetail extends Component {
  render() {
    const { item } = this.props;

    return (
      <div class="ui fluid">
        <div class="ui horizontal divider header">
          <h4>{item.key}</h4>
        </div>
        <table class="ui very basic celled table">
          <thead>
            <tr>
              <th class="two wide">Pets</th>
              <th>User(s) with Pet</th>
              <th class="two wide">Mounts</th>
              <th>User(s) with Mount</th>
            </tr>
          </thead>
          <tbody>
            {
              Array.from(item.petStates.entries()).map(([key, pet]) => {
                const mount = item.mountStates.get(key);
                return (
                  <tr>
                    <td><Pet item={pet}/></td>
                    <td>{pet.users.map((user) => user.data.profile.name).join(', ')}</td>
                    <td>
                      {mount === undefined ? '' : (
                        <Mount item={mount}/>
                      )}
                    </td>
                    <td>
                      {mount === undefined ? '' : (
                        mount.users.map((user) => user.data.profile.name).join(', ')
                      )}
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default CombinedPetDetail;
