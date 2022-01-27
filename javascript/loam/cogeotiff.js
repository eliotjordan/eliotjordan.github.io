var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define("index", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Fetchable = void 0;
    /**
     * Lazily fetch data as required
     */
    var Fetchable = /** @class */ (function () {
        function Fetchable(fetchFunc) {
            var _this = this;
            /** Raw value if the value has been fetched */
            this.value = null;
            /** Last reported error if it exists */
            this.error = null;
            this.valuePromise = null;
            if (typeof fetchFunc === 'function') {
                this.fetchFunc = fetchFunc;
            }
            else {
                this.init(fetchFunc);
                this.fetchFunc = function () { return Promise.resolve(_this.value); };
            }
        }
        /** Initialize the fetchable with a value so it does not need to be fetched */
        Fetchable.prototype.init = function (value) {
            this.valuePromise = Promise.resolve(value);
            this.value = value;
        };
        /**
         * Fetch the value if the value has not been fetched
         */
        Fetchable.prototype.fetch = function () {
            var _this = this;
            if (this.valuePromise == null) {
                this.valuePromise = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, e_1;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                _a = this;
                                return [4 /*yield*/, this.fetchFunc()];
                            case 1:
                                _a.value = _b.sent();
                                if (this.value == null) {
                                    throw new Error('No value was returned');
                                }
                                resolve(this.value);
                                return [3 /*break*/, 3];
                            case 2:
                                e_1 = _b.sent();
                                this.error = e_1;
                                reject(e_1);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
            }
            return this.valuePromise;
        };
        /** Force refetch the value */
        Fetchable.prototype.refetch = function () {
            this.valuePromise = null;
            return this.fetch();
        };
        Object.defineProperty(Fetchable.prototype, "isFetching", {
            /** Is the value currently in the process of being fetched */
            get: function () {
                return this.valuePromise != null && this.value == null;
            },
            enumerable: false,
            configurable: true
        });
        return Fetchable;
    }());
    exports.Fetchable = Fetchable;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vcGFja2FnZXMvZmV0Y2hhYmxlL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRUE7O09BRUc7SUFDSDtRQVFJLG1CQUFZLFNBQTJCO1lBQXZDLGlCQU9DO1lBZEQsOENBQThDO1lBQzlDLFVBQUssR0FBYSxJQUFJLENBQUM7WUFDdkIsdUNBQXVDO1lBQ3ZDLFVBQUssR0FBaUIsSUFBSSxDQUFDO1lBQzNCLGlCQUFZLEdBQXNCLElBQUksQ0FBQztZQUluQyxJQUFJLE9BQU8sU0FBUyxLQUFLLFVBQVUsRUFBRTtnQkFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUF5QixDQUFDO2FBQzlDO2lCQUFNO2dCQUNILElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsY0FBeUIsT0FBQSxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsRUFBM0IsQ0FBMkIsQ0FBQzthQUN6RTtRQUNMLENBQUM7UUFDRCw4RUFBOEU7UUFDOUUsd0JBQUksR0FBSixVQUFLLEtBQVE7WUFDVCxJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDdkIsQ0FBQztRQUVEOztXQUVHO1FBQ0gseUJBQUssR0FBTDtZQUFBLGlCQWdCQztZQWZHLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLEVBQUU7Z0JBQzNCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBTyxPQUFPLEVBQUUsTUFBTTs7Ozs7O2dDQUU5QyxLQUFBLElBQUksQ0FBQTtnQ0FBUyxxQkFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUE7O2dDQUFuQyxHQUFLLEtBQUssR0FBRyxTQUFzQixDQUFDO2dDQUNwQyxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxFQUFFO29DQUNwQixNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7aUNBQzVDO2dDQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Ozs7Z0NBRXBCLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBVSxDQUFDO2dDQUN4QixNQUFNLENBQUMsR0FBQyxDQUFDLENBQUM7Ozs7O3FCQUVqQixDQUFDLENBQUM7YUFDTjtZQUNELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztRQUM3QixDQUFDO1FBRUQsOEJBQThCO1FBQzlCLDJCQUFPLEdBQVA7WUFDSSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztZQUN6QixPQUFPLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN4QixDQUFDO1FBR0Qsc0JBQUksaUNBQVU7WUFEZCw2REFBNkQ7aUJBQzdEO2dCQUNJLE9BQU8sSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUM7WUFDM0QsQ0FBQzs7O1dBQUE7UUFDTCxnQkFBQztJQUFELENBQUMsQUFyREQsSUFxREM7SUFyRFksOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgdHlwZSBGZXRjaEZ1bmM8VD4gPSAoKSA9PiBQcm9taXNlPFQ+O1xuXG4vKipcbiAqIExhemlseSBmZXRjaCBkYXRhIGFzIHJlcXVpcmVkXG4gKi9cbmV4cG9ydCBjbGFzcyBGZXRjaGFibGU8VCA9IHVua25vd24+IHtcbiAgICAvKiogUmF3IHZhbHVlIGlmIHRoZSB2YWx1ZSBoYXMgYmVlbiBmZXRjaGVkICovXG4gICAgdmFsdWU6IFQgfCBudWxsID0gbnVsbDtcbiAgICAvKiogTGFzdCByZXBvcnRlZCBlcnJvciBpZiBpdCBleGlzdHMgKi9cbiAgICBlcnJvcjogRXJyb3IgfCBudWxsID0gbnVsbDtcbiAgICB2YWx1ZVByb21pc2U6IFByb21pc2U8VD4gfCBudWxsID0gbnVsbDtcbiAgICBmZXRjaEZ1bmM6IEZldGNoRnVuYzxUIHwgbnVsbD47XG5cbiAgICBjb25zdHJ1Y3RvcihmZXRjaEZ1bmM6IFQgfCBGZXRjaEZ1bmM8VD4pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBmZXRjaEZ1bmMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hGdW5jID0gZmV0Y2hGdW5jIGFzIEZldGNoRnVuYzxUPjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdChmZXRjaEZ1bmMpO1xuICAgICAgICAgICAgdGhpcy5mZXRjaEZ1bmMgPSAoKTogUHJvbWlzZTxUIHwgbnVsbD4gPT4gUHJvbWlzZS5yZXNvbHZlKHRoaXMudmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKiBJbml0aWFsaXplIHRoZSBmZXRjaGFibGUgd2l0aCBhIHZhbHVlIHNvIGl0IGRvZXMgbm90IG5lZWQgdG8gYmUgZmV0Y2hlZCAqL1xuICAgIGluaXQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy52YWx1ZVByb21pc2UgPSBQcm9taXNlLnJlc29sdmUodmFsdWUpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmV0Y2ggdGhlIHZhbHVlIGlmIHRoZSB2YWx1ZSBoYXMgbm90IGJlZW4gZmV0Y2hlZFxuICAgICAqL1xuICAgIGZldGNoKCk6IFByb21pc2U8VD4ge1xuICAgICAgICBpZiAodGhpcy52YWx1ZVByb21pc2UgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZVByb21pc2UgPSBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IGF3YWl0IHRoaXMuZmV0Y2hGdW5jKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gdmFsdWUgd2FzIHJldHVybmVkJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IgPSBlIGFzIEVycm9yO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVQcm9taXNlO1xuICAgIH1cblxuICAgIC8qKiBGb3JjZSByZWZldGNoIHRoZSB2YWx1ZSAqL1xuICAgIHJlZmV0Y2goKTogUHJvbWlzZTxUPiB7XG4gICAgICAgIHRoaXMudmFsdWVQcm9taXNlID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2goKTtcbiAgICB9XG5cbiAgICAvKiogSXMgdGhlIHZhbHVlIGN1cnJlbnRseSBpbiB0aGUgcHJvY2VzcyBvZiBiZWluZyBmZXRjaGVkICovXG4gICAgZ2V0IGlzRmV0Y2hpbmcoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlUHJvbWlzZSAhPSBudWxsICYmIHRoaXMudmFsdWUgPT0gbnVsbDtcbiAgICB9XG59XG4iXX0=