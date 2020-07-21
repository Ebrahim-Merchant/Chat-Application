import { Subject } from "rxjs";

const subject = new Subject();

export const newMessage = {
  setData: data => subject.next(data),
  clearData: () => subject.next(),
  getData: () => subject.asObservable()
};