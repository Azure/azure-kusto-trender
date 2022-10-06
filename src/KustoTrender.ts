import UXClient from "./UXClient/UXClient";
import Utils from "./UXClient/Utils";
import * as ADXClasses from "./ServerClient";

class KustoTrender {
    public ux = new UXClient();
    public utils = Utils;
}
export default KustoTrender;

(<any>window).KustoTrender = KustoTrender;
(<any>window).ADX = ADXClasses;