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

    $(function () {
        $("#button").dxButton({
            text: 'Nuevo Ticket',
            onClick: function() {
                connection.invoke("AgregaTicket").then(function () {
                
                });
            }
        });
    });

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
            { caption: "AtendidoPor", dataField: "Cambiado por", },
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
           ],
        onRowPrepared: function (info) {

        },


    });

   
});