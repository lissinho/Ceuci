Template.pessoa.helpers({
    tipoFormulario() {
        return FlowRouter.getParam("_id") == undefined
                    ? "insert"
                    : "update";
    },
    documento() {
        return Pessoas.findOne({ _id: FlowRouter.getParam("_id") });
    }
});

AutoForm.addHooks('formPessoa', {
    onSuccess: function (formType, result) {
        FlowRouter.go("/admin/pessoas");
    },
    onError: function (formType, error) {
        toastr.error(error);
    }
  });