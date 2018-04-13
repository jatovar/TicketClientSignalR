var USUARIO_LOGIN = "Anonimo"

let connection = new signalR.HubConnection("https://sepsignalr.azurewebsites.net/MesaDeTicketsHub");
connection.start().then(function () {
    connection.invoke("ObtieneTickets").then(function (tickets) {
        for(let i = 0; i < tickets.length; i++)
            console.log(tickets[i]);
        var instance = $('#gridTickets').dxDataGrid('instance');
        
        instance.beginCustomLoading("Cargando..");
        $('#gridTickets').dxDataGrid('option', 'dataSource', tickets);
        instance.endCustomLoading();
    });
});

connection.on("refrescaTickets", function (tickets) {
    $('#gridTickets').dxDataGrid('option', 'dataSource', tickets);
});

$(function () {
    /*
    $(function () {
        $("#button").dxButton({
            text: 'Nuevo Ticket',
            onClick: function() {
                connection.invoke("AgregaTicket").then(function () {
                
                });
            }
        });
    });
    */
    $('#gridTickets').dxDataGrid({
        loadPanel: {
            enabled: true,
        },
        filterRow: {
            visible: true,
        },
        dataSource: [],
        focusStateEnabled: true,
        rowAlternationEnabled: false,
        hoverStateEnabled: false,
        selection: {
            mode: "single"
        },
        showBorders: true,
        noDataText: "Aún no hay tickets",
        columns: [
            { caption: "Id", dataField: "id"},
            { caption: "Cambiado Por", dataField: "atendidoPor", },
            { caption: "UsuarioReporte", dataField: "usuarioReporte", },
            { caption: "Fecha", dataField: "fecha", dataType: 'datetime', format: 'dd/MM/yyyy hh:mm:ssa' },
            { caption: "Motivo", dataField: "motivo", },
            {
                caption: "Estatus",
                cellTemplate: function (container, options) {
                    var estatus = options.data.status;
                    var content = "";
                    switch(estatus) {
                        case 0: 
                            content = "CERRADO";
                        break;
                        case 1:
                            content = "ACTIVO";
                        break;
                        case 2:
                            content = "EN PROCESO";
                        break;
                        case 3:
                            content = "DESCARTADO";
                        break;
                    }

                    container.append(content);
                },
                dataField: "status",
            },
            {
                caption: "",
                alignment: "center",
                cellTemplate: function (container, options) {

                    var id = options.data.id;
                    var estatus = options.data.status;
                    var operador = options.data.atendidoPor;
                    if (estatus == 1) //Siniestros activos
                        var content = '<button data-id="' + id + '" type= "button" class = "btn btn-default" onclick="asigna(this);">Atender</button>';
                    else {                //Siniestros EA en atención                
                        if (operador ==  USUARIO_LOGIN) {
                            var content = '<button data-id="' + id + '" type= "button" class = "btn btn-default" onclick="libera(this);">Liberar</button>';
                        } else {
                            var content = '<button disabled data-id="' + id + '" type= "button" class = "btn btn-default" ">En atención..</button>';
                        }
                    }
                    container.append(content);
                }
            },
           ],
        onRowPrepared: function (info) {

        },


    });

   
});


function asigna(e) {
    console.log($(e).data('id'));
    $(e).text('Asignando...');
    $(e).prop('disabled', true);

    connection.invoke("CambiaEstadoTicket",$(e).data('id'), USUARIO_LOGIN, 2).then(function () {

    });
}

function libera(e) {
    $(e).text('Liberando...');
    $(e).prop('disabled', true);

    connection.invoke("CambiaEstadoTicket",$(e).data('id'), USUARIO_LOGIN, 1).then(function () {

    });
}