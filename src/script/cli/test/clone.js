module.exports = (function(){
    return {
        cloneDeep : function cloneDeep(pObject) {
            return JSON.parse(JSON.stringify(pObject));
        }
    };
})();
