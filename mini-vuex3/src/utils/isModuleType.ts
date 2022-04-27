/**
 * 是否是 module 类型
 * 'user/age' => true
 * @param name 
 * @returns 
 */
export function isModuleType(name) {
    return /^\w+\/\w+$/.test(name);
}
