Template.fundo.helpers({
    tipoFormulario() {
        return FlowRouter.getParam("_id") == undefined
                    ? "insert"
                    : "update";
    },
    documento() {
        return Fundos.findOne({ _id: FlowRouter.getParam("_id") });
    }
});

AutoForm.addHooks('formFundo', {
    onSuccess: function (formType, result) {
        FlowRouter.go("/admin/fundos");
    },
    onError: function (formType, error) {
        toastr.error(error);
    }
});
