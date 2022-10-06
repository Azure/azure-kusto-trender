import UXClient from "./UXClient/UXClient";
import Utils from "./UXClient/Utils";
import * as ADXClasses from "./ServerClient";

class TsiClient {
    public ux = new UXClient();
    public utils = Utils;
}
export default TsiClient;

(<any>window).TsiClient = TsiClient;
(<any>window).ADX = ADXClasses;