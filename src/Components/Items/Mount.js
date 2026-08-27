import Item from './Item';
import MountIcon from './MountIcon';

class Mount extends MountIcon {
  renderItemContent(item) {
    return (
      <span class={'item-content ' + this.constructor.type + ' ' + this.constructor.imageFilenameBase + item.imageKey} onClick={this.showItemInfo}>
        <img src={Item.imageURL + 'Mount_Body_' + item.imageKey + this.imageFilenameExtension} alt={item.key} />
        <img src={Item.imageURL + 'Mount_Head_' + item.imageKey + this.imageFilenameExtension} alt={item.key} />
      </span>
    )
  }
}

export default Mount;
