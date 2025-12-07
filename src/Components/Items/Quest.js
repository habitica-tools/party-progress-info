import Item from './Item';

class Quest extends Item {
  static type = 'Quest';
  static imageFilenameBase = 'inventory_quest_scroll_';
  static showItemCaption = false;
}

export default Quest;
