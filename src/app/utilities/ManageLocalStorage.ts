import {GroupItineraryVoyager} from '../models/group-itinerary-voyager/GroupItineraryVoyager';

export class ManageLocalStorage {

  static saveGroupItineraryVoyager(group: GroupItineraryVoyager) {
    localStorage.setItem('groupItineraryVoyager', JSON.stringify(group));
  }

  static getGroupItineraryVoyager(): GroupItineraryVoyager {
    return JSON.parse(localStorage.getItem('groupItineraryVoyager'));
  }
}
