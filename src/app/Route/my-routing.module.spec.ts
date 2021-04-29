import { MyRoutingModule } from './my-routing.module';

describe('MyRoutingModule', () => {
  let myRoutingModule: MyRoutingModule;

  beforeEach(() => {
    myRoutingModule = new MyRoutingModule();
  });

  it('should create an instance', () => {
    expect(myRoutingModule).toBeTruthy();
  });
});
