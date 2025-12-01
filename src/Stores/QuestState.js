import ItemState from './ItemState';

class QuestState extends ItemState {
  static type = 'Quest';

  static userItems(user) {
    return user.data.items.quests;
  }

  get tooltip() {
    return this.data.text;
  }
}

export default QuestState;
