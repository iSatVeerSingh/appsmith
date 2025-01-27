import {
  getBindingTemplate,
  stringToJS,
} from "components/propertyControls/SelectDefaultValueControl";
import { isDynamicValue } from "utils/DynamicBindingUtils";
import { traverseDSLAndMigrate } from "utils/WidgetMigrationUtils";
import type { WidgetProps } from "widgets/BaseWidget";
import type { DSLWidget } from "widgets/constants";

const SelectTypeWidgets = ["SELECT_WIDGET", "MULTI_SELECT_WIDGET_V2"];

export function MigrateSelectTypeWidgetDefaultValue(currentDSL: DSLWidget) {
  currentDSL.children = currentDSL.children?.map((child: WidgetProps) => {
    if (SelectTypeWidgets.includes(child.type)) {
      const defaultOptionValue = child.defaultOptionValue;
      const { prefixTemplate, suffixTemplate } = getBindingTemplate(
        child.widgetName,
      );

      if (
        typeof defaultOptionValue === "string" &&
        isDynamicValue(defaultOptionValue) &&
        !defaultOptionValue.endsWith(suffixTemplate) &&
        !defaultOptionValue.startsWith(prefixTemplate)
      ) {
        child.defaultOptionValue = `${prefixTemplate}${stringToJS(
          defaultOptionValue,
        )}${suffixTemplate}`;
      }
    } else if (child.children && child.children.length > 0) {
      child = MigrateSelectTypeWidgetDefaultValue(child);
    }
    return child;
  });

  return currentDSL;
}

export function migrateSelectWidgetOptionToSourceData(currentDSL: DSLWidget) {
  return traverseDSLAndMigrate(currentDSL, (widget: WidgetProps) => {
    if (
      ["SELECT_WIDGET", "MULTI_SELECT_WIDGET_V2"].includes(widget.type) &&
      widget.options
    ) {
      widget.sourceData = widget.options;
      widget.optionLabel = "label";
      widget.optionValue = "value";

      delete widget.options;
    }
  });
}
