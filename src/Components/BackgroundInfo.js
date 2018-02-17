import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';

@observer
class BackgroundInfo extends Component {
    render({category, store}) {
        return (
            <div>
        {[...store.Background].filter(([id,Background]) => Background.id === category)
                        .map(([id,Background]) =>        
                <div class="ui mini modal active">
                    <div class="header">{Background.data.text}
                    <button class="ui icon right floated button" onClick={this.Close}>
                        <i class="close icon"></i>
                    </button>
                    </div>
                    <div class="content">
                    {Background.users.map(user => user.data.profile.name).join(', ')}
                    </div>
                </div>     
        )}   
        </div>
        );

    }

    Close = (e) => {
        this.props.Backgroundlist.hideBackgroundInfo();
    }    
}


export default BackgroundInfo;