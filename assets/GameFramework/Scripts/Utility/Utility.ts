import { CommonUtility } from "./CommonUtility";
import { DateUtility } from "./DateUtility";
import { MathUtility } from "./MathUtility";
import { Random } from "./Random";
import { TextUtility } from "./TextUtility";

export class Utility {
    /** 通用工具类 */
    static readonly Common: CommonUtility = new CommonUtility();
    /** 随机工具类 */
    static readonly Random: Random = new Random();
    /** 日期工具类 */
    static readonly Date: DateUtility = new DateUtility();
    /** 数学工具类 */
    static readonly Math: MathUtility = new MathUtility();
    /** 文本工具类 */
    static readonly Text: TextUtility = new TextUtility();
}
