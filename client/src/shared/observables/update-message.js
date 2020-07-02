import { Subject } from "rxjs";
const subject = new Subject();

export const updateMessage = {
  setData: data => subject.next(data),
  clearData: () => subject.next(),
  getData: () => subject.asObservable(),
};

