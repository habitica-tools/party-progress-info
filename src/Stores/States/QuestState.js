import ItemState from './ItemState';

class QuestState extends ItemState {
  static userItems(user) {
    return user.data.items.quests;
  }
}

export default QuestState;
