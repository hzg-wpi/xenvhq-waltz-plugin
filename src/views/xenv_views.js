import {codemirror_textarea} from "@waltz-controls/waltz-webix-extensions";
import 'codemirror/mode/xml/xml.js';

import {newXenvMainBody} from "./xenv_hq_main_view.js";
import {newDataSourcesBody} from "./xenv_datasources_view.js";
import {kXenvHqPanelId, kXenvLeftPanel} from "widgets/xenv";
import {newDfsViewBody} from "./xenv_dfs_view";
import {newStatusServerViewBody} from "./xenv_status_server_view";
import {newCamelIntegrationViewBody} from "./xenv_camel_view";
import {newPredatorViewBody} from "./xenv_predator_view";

const xml = webix.protoUI({
    name: "xml",
    update(value) {
        if (!value || !this.editor) return;
        this.setValue(value);
    }
}, codemirror_textarea);

export function newXmlView() {
    return {
        gravity: 2,
        rows: [
            {
                view: "xml",
                id: "xml",
                mode: "application/xml",
                matchClosing: true
            }
        ]
    }
}

export function newXenvServerLog() {
    return {
        view:"list",
        id:'log',
        type:{
            height: "auto",
            template(obj){
                return `<div>
                            <div>${obj.name}</div>
                            <div><strong>${obj.data}</strong></strong></div>
                            <div><span class="webix_icon mdi mdi-clock-outline"></span>${obj.timestamp} <span class="webix_icon mdi mdi-calendar-clock"></span>${new Date(obj.timestamp)}</div>
                        </div>`;
            }
        }
    }
}

export function newXenvHqToolbar() {
    return {
        view: "toolbar",
        maxHeight: 30,
        cols: [
            {},
            {
                view: "icon",
                icon: "mdi mdi-settings",
                maxWidth: 30,
                click: function () {
                    const $$HQsettings = this.getTopParentView().$$("settings");
                    if ($$HQsettings.isVisible())
                        $$HQsettings.hide();
                    else
                        $$HQsettings.show();
                }
            }
        ]
    }
}

export function newXenvHqSettings(config) {
    return {
        id: 'settings',
        hidden: true,
        isolate: true,
        drag: "target",
        rows: [
            {
                id: "main",
                view: "text",
                value: "",
                required: true,
                readonly: true,
                label: "HQ main",
                labelWidth: 240,
                tooltip: "HQ main",
                labelAlign: "right"
            },
            {
                id: "configuration",
                view: "text",
                value: "",
                required: true,
                readonly: true,
                label: "HQ configuration manager",
                labelWidth: 240,
                tooltip: "HQ configuration manager",
                labelAlign: "right"
            },
            {
                id: "manager",
                view: "text",
                value: "",
                required: true,
                readonly: true,
                label: "HQ xenv servers manager",
                labelWidth: 240,
                tooltip: "HQ xenv servers manager",
                labelAlign: "right"
            },
            {
                id: "camel",
                view: "text",
                value: "",
                readonly: true,
                label: "CamelIntegration",
                labelWidth: 240,
                tooltip: "CamelIntegration",
                labelAlign: "right"
            },
            {
                id: "status_server",
                view: "text",
                value: "",
                readonly: true,
                label: "StatusServer",
                labelWidth: 240,
                tooltip: "StatusServer",
                labelAlign: "right"
            },
            {
                id: "data_format_server",
                view: "text",
                value: "",
                readonly: true,
                label: "DataFormatServer",
                labelWidth: 240,
                tooltip: "DataFormatServer",
                labelAlign: "right"
            },
            {
                id: "predator",
                view: "text",
                value: "",
                readonly: true,
                label: "PreExperimentDataCollector",
                labelWidth: 240,
                tooltip: "PreExperimentDataCollector",
                labelAlign: "right"
            },
            {},
            {
                cols: [
                    {},
                    {
                        view: "button",
                        value: "Apply",
                        maxWidth: 120,
                        click() {
                            config.root.run();
                        }
                    }
                ]
            }
        ]
    }
}

export function newXenvHqBody(config){
    return {
        view: "tabview",
        cells: [
            {
                header: "Main",
                body: newXenvMainBody(config)
            },
            {
                header: "DataSources",
                body: newDataSourcesBody(config)
            },
            {
                header: "Xenv Log",
                body: newXenvServerLog(config),
            },
            {
                header: "DataFormatServer",
                body: newDfsViewBody(config)
            },
            {
                header: "StatusServer",
                body: newStatusServerViewBody(config)
            },
            {
                header: "CamelIntegration",
                body: newCamelIntegrationViewBody(config)
            },
            {
                header: "PreExperimentDataCollector",
                body: newPredatorViewBody(config)
            }
        ]
    };
}

export function newXenvHqBottom(config) {
    return {
        view: "button",
        value: "Update & Restart all",
        minHeight: 80,
        click() {
            config.root.view.$$('main_tab').showProgress({
                type: "top",
                delay: 500,
                hide: true
            });
            config.root.updateAndRestartAll()
                .finally(() => config.root.view.$$('main_tab').hideProgress())
        }
    }
}

const kXenvHqPanelHeader = '<span class="webix_icon mdi mdi-cube-scan"></span>XenvHQ DataSources Collections';

function newDataSourceCollectionForm(config) {
    return {
        view: "form",
        id: "frmCollectionSettings",
        hidden: true,
        elements: [
            {
                view: "text",
                name: "id",
                label: "Name",
                labelAlign: "right",
                validate: webix.rules.isNotEmpty
            },
            {
                view: "text",
                id: "txtCollectionProto",
                name: "value",
                label: "Copy from",
                labelAlign: "right"
            },
            {
                cols: [
                    {
                        view: "icon",
                        icon: "wxi-trash",
                        maxWidth: 30,
                        tooltip: "Delete selected profile",
                        click() {
                            // parent.deleteCollection(values.id).then(() => {
                            //     parent.collections.remove(values.id);
                            //     parent.datasources.clearAll();
                            //     parent.$$('selectDataSources').setValue("");
                            // });
                            config.root.deleteCollection(config.root.$$panel.$$('list').getSelectedId());
                            this.getFormView().clear();
                        }
                    },
                    {},
                    {
                        view: "icon",
                        id: 'btnAddProfile',
                        icon: "mdi mdi-content-save",
                        maxWidth: 30,
                        click() {
                            const $$frm = this.getFormView();
                            if (!$$frm.validate()) return;

                            const values = $$frm.getValues();

                            const id = config.root.addCollection(values);

                            this.getTopParentView().$$('list').select(id);
                        }
                    }
                ]
            }
        ]
    };
}

function newFavorites(config){
    return {
        id: 'favorites',
        isolate: true,
        hidden: true,
        type: 'clean',
        rows: [
            {
                id: 'list',
                view: 'list',
                select: true,
                template: '#name#',
                on: {
                    onItemClick(id) {
                        config.root.selectFavorite(id);
                    }
                }
            },
            {
                id:'form',
                view: 'form',
                cols: [
                    {
                        view: "icon",
                        icon: "wxi-trash",
                        maxWidth: 30,
                        tooltip: "Delete selected favorite",
                        click() {
                            config.root.deleteFavorite(this.getTopParentView().$$('list').getSelectedId());
                            this.getFormView().clear();
                        }
                    },
                    {
                        view: 'text',
                        type: 'hidden',
                        hidden: true,
                        name: 'id'
                    },
                    {
                        view:'text',
                        name:'name',
                        placeholder: 'New favorite name'
                    },
                    {
                        view: "icon",
                        icon: "mdi mdi-star",
                        maxWidth: 30,
                        tooltip: "Save new favorite...",
                        click() {
                            const $$form = this.getFormView();
                            $$form.elements.id.setValue(+new Date());
                            if(!$$form.validate()) return;

                            $$form.clearValidation();
                            config.root.addFavorite($$form.getValues());
                        }
                    }
                ],
                rules: {
                    name: webix.rules.isNotEmpty
                }
            }
        ]
    };
}

export function newXenvHqLeftPanel(config) {
    return {
        view: 'accordionitem',
        id: kXenvLeftPanel,
        header: kXenvHqPanelHeader,
        headerAlt: kXenvHqPanelHeader,
        headerHeight: 32,
        headerAltHeight: 32,
        collapsed: true,
        body: {
            id: kXenvHqPanelId,
            isolate: true,
            rows: [
                {
                    id: 'list',
                    view: "list",
                    select: true,
                    template: "#id#",
                    on: {
                        onItemClick(id) {
                            if (this.getSelectedId() === id) {
                                this.unselectAll()
                                this.select(id);
                            }
                        },
                        onAfterSelect(id) {
                            config.root.selectCollection(id);
                        },
                        onAfterLoad() {
                            if (this.count() > 0)
                                this.select(this.getFirstId());
                        }
                    }
                },
                newDataSourceCollectionForm(config),
                {
                    view: 'template',
                    template: '<span class="hide_show_favorities"><span class="webix_icon mdi mdi-star-half-full"></span> Favorite Collections presets</span>',
                    borderless: true,
                    type:'header',
                    onClick:{
                        "hide_show_favorities":function(ev, id){
                            const $$favorites = this.getTopParentView().$$('favorites');
                            if ($$favorites.isVisible())
                                $$favorites.hide();
                            else
                                $$favorites.show();
                            return false; // blocks the default click behavior
                        }
                    }
                },
                newFavorites(config),
                {
                    borderless: true,
                    view: "toolbar",
                    cols: [
                        {
                            view: "icon",
                            icon: "mdi mdi-cog",
                            tooltip: "Toggle XenvHq settings",
                            maxWidth: 30,
                            click() {
                                const $$settings = config.root.$$settings;
                                if ($$settings.isVisible())
                                    config.root.$$body.show();
                                else
                                    $$settings.show();
                            }
                        },
                        {},
                        {
                            view: "icon",
                            icon: "mdi mdi-sort-alphabetical-variant",
                            tooltip: "Sort SataSources",
                            maxWidth: 30,
                            lastSortDir: 'asc',
                            click() {
                                this.getTopParentView().$$('list').sort("#id#", this.lastSortDir = this.lastSortDir === 'asc' ? 'desc' : 'asc')
                            }
                        },
                        {
                            view: "icon",
                            icon: "wxi-plus",
                            tooltip: "Show new profile form",
                            maxWidth: 30,
                            click() {
                                const $$frmCollection = this.getTopParentView().$$('frmCollectionSettings');
                                if ($$frmCollection.isVisible())
                                    $$frmCollection.hide();
                                else
                                    $$frmCollection.show();
                            }
                        }
                    ]
                }
            ]

        }
    }
}