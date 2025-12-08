import PetState from './PetState';

class MountState extends PetState {
  get tooltip() {
    return this.potion.tooltip + ' ' + this.egg.mountTooltip;
  }
}

export default MountState;
