import { ProductPage } from "../../pages/productPage";

export async function fillAppleCinemaOptions(product: ProductPage, uploadFilePath: string): Promise<void> {
  await product.chooseRadioValue("5");
  await product.chooseCheckboxValue("8");
  await product.fillTextOption("option[208]", "Test text");
  await product.fillTextareaOption("option[209]", "Some longer text");
  await product.fillSelectOption("option[217]", 1);
  await product.uploadFileOption("button-upload-222", uploadFilePath);
  await product.fillDateOption("option[219]", "2011-02-20");
  await product.fillDatetimeOption("option[220]", "2011-02-20T22:25:00");
  await product.fillTimeOption("option[221]", "22:25");
}
