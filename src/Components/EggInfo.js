import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';

@observer
class EggInfo extends Component {
    render({category, store}) {
        return (
        <div class="ui mini modal active">
            <div class="header">{category}
            <button class="ui icon right floated button" onClick={this.Close}>
                <i class="close icon"></i>
            </button>
            </div>
            <div class="content">
                    {[...store.alleggs].filter(([id,egg]) => egg.id === category)
                        .map(([id,egg]) =>
                        egg.users
                        .sort(function(a,b){
                            if(egg.usercount(a) > egg.usercount(b)){
                                return -1;
                            }
                            if(egg.usercount(a) < egg.usercount(b)){
                                return 1;
                            }
                            return 0;
                        })
                        .map(user =>
                        <div key={user.id}>
                            {user.data.profile.name + " has " + egg.usercount(user)}
                        </div>)
                    )}
            </div>
        </div>
        );

    }

    Close = (e) => {
        this.props.egglist.hideEggInfo();
    }
}


export default EggInfo;