import Item from './Item';

class Gear extends Item {
  static type = 'Gear';
  static imageFilenameBase = 'shop_'
  static showItemCaption = false;
}

export default Gear;
