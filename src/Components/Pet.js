import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';

@observer
class Pet extends Component {

    render({pet}) {
        return (
            <div>
                <div class={"pet-evolved Pet-" + pet.id}>

                </div>
                <div class="badge badge-warning stack-count">
                    {pet.needed}
                </div>
                <div class="badge badge-info stack-count">
                    {pet.count}
                </div>                
            </div>
        );
    }  
    
}


export default Pet;