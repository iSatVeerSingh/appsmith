import {
  entityExplorer,
  locators,
  agHelper,
  propPane,
  assertHelper,
  draggableWidgets,
} from "../../../../support/Objects/ObjectsCore";

describe("Dynamic Height Width validation with multiple containers and text widget", function () {
  it("1. Validate change with auto height width for widgets", function () {
    let textMsg =
      "Dynamic panel validation for text widget wrt height Dynamic panel validation for text widget wrt height Dynamic panel validation for text widget wrt height";
    agHelper.AddDsl("dynamicHeightCanvasResizeDsl");

    // Select the Outer container and capture initial height
    entityExplorer.SelectEntityByName("Container1");
    agHelper
      .GetWidgetCSSHeight(
        locators._widgetInDeployed(draggableWidgets.CONTAINER),
      )
      .then((initialContainerHeight: number) => {
        // Select the Text Widget and capture its initial height
        entityExplorer.SelectEntityByName("Text1", "Container1");
        agHelper.Sleep(1000);
        agHelper
          .GetWidgetCSSHeight(locators._widgetInDeployed(draggableWidgets.TEXT))
          .then((initialTextWidgetHeight: number) => {
            // Change the text label based on the textMsg above
            propPane.UpdatePropertyFieldValue("Text", textMsg);
            propPane.MoveToTab("Style");
            assertHelper.AssertNetworkStatus("@updateLayout", 200);
            // Select the Text Widget and capture its updated height post change of text label
            entityExplorer.SelectEntityByName("Text1");
            agHelper
              .GetWidgetCSSHeight(
                locators._widgetInDeployed(draggableWidgets.TEXT),
              )
              .then((updatedTextWidgetHeight: number) => {
                // Asserts the change in height from initial height of text widget wrt updated height
                expect(initialTextWidgetHeight).to.not.equal(
                  updatedTextWidgetHeight,
                );
                // Select the outer Container Widget and capture its updated height post change of text label
                entityExplorer.SelectEntityByName("Container1");
                agHelper
                  .GetWidgetCSSHeight(
                    locators._widgetInDeployed(draggableWidgets.CONTAINER),
                  )
                  .then((updatedContainerHeight: number) => {
                    // Asserts the change in height from initial height of container widget wrt updated height
                    expect(initialContainerHeight).to.not.equal(
                      updatedContainerHeight,
                    );
                    entityExplorer.SelectEntityByName("Text1");
                    propPane.MoveToTab("Content");
                    // Clear Text Label
                    propPane.RemoveText("Text");
                    assertHelper.AssertNetworkStatus("@updateLayout", 200);
                    entityExplorer.SelectEntityByName("Container1");
                    agHelper
                      .GetWidgetCSSHeight(
                        locators._widgetInDeployed(draggableWidgets.CONTAINER),
                      )
                      .then((revertedContainerHeight: number) => {
                        // Asserts the change in height from updated height of container widget wrt current height
                        // As the text label is cleared the reverted height should be equal to initial height
                        expect(initialContainerHeight).to.equal(
                          revertedContainerHeight,
                        );
                      });
                  });
              });
          });
      });
  });
});
