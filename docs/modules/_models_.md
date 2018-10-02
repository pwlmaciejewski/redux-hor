[higher-order-redux](../README.md) > ["models"](../modules/_models_.md)

# External module: "models"

## Index

### Type aliases

* [ContextProvider](_models_.md#contextprovider)
* [HORCreator](_models_.md#horcreator)
* [HigherOrderReducer](_models_.md#higherorderreducer)

---

## Type aliases

<a id="contextprovider"></a>

###  ContextProvider

**Ƭ ContextProvider**: *`function`*

*Defined in [models.ts:5](https://github.com/pwlmaciejewski/redux-hor/blob/d49db45/src/models.ts#L5)*

#### Type declaration
▸(state: *`S`*, action: *`A`*): `C`

**Parameters:**

| Param | Type |
| ------ | ------ |
| state | `S` |
| action | `A` |

**Returns:** `C`

___
<a id="horcreator"></a>

###  HORCreator

**Ƭ HORCreator**: *`function`*

*Defined in [models.ts:7](https://github.com/pwlmaciejewski/redux-hor/blob/d49db45/src/models.ts#L7)*

#### Type declaration
▸(context: *`C`*): [HigherOrderReducer](_models_.md#higherorderreducer)<`S`, `A`>

**Parameters:**

| Param | Type |
| ------ | ------ |
| context | `C` |

**Returns:** [HigherOrderReducer](_models_.md#higherorderreducer)<`S`, `A`>

___
<a id="higherorderreducer"></a>

###  HigherOrderReducer

**Ƭ HigherOrderReducer**: *`function`*

*Defined in [models.ts:3](https://github.com/pwlmaciejewski/redux-hor/blob/d49db45/src/models.ts#L3)*

#### Type declaration
▸(reducer: *`Reducer`<`S`, `A`>*): `Reducer`<`S`, `A`>

**Parameters:**

| Param | Type |
| ------ | ------ |
| reducer | `Reducer`<`S`, `A`> |

**Returns:** `Reducer`<`S`, `A`>

___

