import Item from './Item';

class Background extends Item {
  static type = 'Background';
  static imageFilenameBase = 'background_';
  static showItemCaption = false;

  get imageFilenameExtension() {
    if (this.props.item.data && this.props.item.data.set === 'timeTravelBackgrounds') {
      return '.gif';
    }
    return '.png';
  }
}

export default Background;
