import { InMemoryProductsRepository } from "test/in-memory-repositories/in-memory-products-repository"
import { InMemoryUsersRepository } from "test/in-memory-repositories/in-memory-users-repository"
import { EditProductUseCase } from "../edit-product"
import { InMemoryCategoriesRepository } from "test/in-memory-repositories/in-memory-categorys-repository"

describe("Edit Product Unit Tests", () => {
  let sut: EditProductUseCase
  let productsRepo: InMemoryProductsRepository
  let usersRepo: InMemoryUsersRepository
  let categoryRepo: InMemoryCategoriesRepository

  beforeEach(() => {
    productsRepo = new InMemoryProductsRepository()
    usersRepo = new InMemoryUsersRepository()
    categoryRepo = new InMemoryCategoriesRepository()
    sut = new EditProductUseCase(productsRepo, usersRepo, categoryRepo)
  })

  it("should allow product creator to edit", async () => {
    // const user = makeUser()
    // usersRepo.items.push(user)

    // const product = makeProduct({ createdByUserId: user.id })
    // productsRepo.items.push(product)

    // const result = await sut.execute({
    //   productId: product.id.toString(),
    //   updatedByUserId: user.id.toString(),
    //   name: "New Product Name"
    // })

    // expect(isRight(result)).toBeTruthy()
    // if (isRight(result)) {
    //   expect(result.right.product.name).toBe("New Product Name")
    // }
  })

  // it("should allow admin to edit any product", async () => {
  //   const user = makeUser({ role: "admin" })
  //   usersRepo.items.push(user)

  //   const product = makeProduct()
  //   productsRepo.items.push(product)

  //   const result = await sut.execute({
  //     productId: product.id.toString(),
  //     updatedByUserId: user.id.toString(),
  //     description: "Updated Description"
  //   })

  //   expect(isRight(result)).toBeTruthy()
  //   if (isRight(result)) {
  //     expect(result.right.product.description).toBe("Updated Description")
  //   }
  // })

  // it("should not allow edit if user is not creator nor admin", async () => {
  //   const user = makeUser({ role: "seller" })
  //   usersRepo.items.push(user)

  //   const product = makeProduct()
  //   productsRepo.items.push(product)

  //   const result = await sut.execute({
  //     productId: product.id.toString(),
  //     updatedByUserId: user.id.toString(),
  //     name: "Hacker Name"
  //   })

  //   expect(isLeft(result)).toBeTruthy()
  //   expect(unwrapEither(result)).toBeInstanceOf(UserNotAuthorizedError)
  // })

  // it("should return error if product does not exist", async () => {
  //   const user = makeUser()
  //   usersRepo.items.push(user)

  //   const result = await sut.execute({
  //     productId: "non-existing-id",
  //     updatedByUserId: user.id.toString(),
  //     name: "Name"
  //   })

  //   expect(isLeft(result)).toBeTruthy()
  //   expect(unwrapEither(result)).toBeInstanceOf(ProductNotFoundError)
  // })

  // it("should return error if user does not exist", async () => {
  //   const product = makeProduct()
  //   productsRepo.items.push(product)

  //   const result = await sut.execute({
  //     productId: product.id.toString(),
  //     updatedByUserId: "non-existing-user-id",
  //     name: "Name"
  //   })

  //   expect(isLeft(result)).toBeTruthy()
  //   expect(unwrapEither(result)).toBeInstanceOf(UserNotFoundError)
  // })

  // it("should return error if updating name conflicts with existing product", async () => {
  //   const user = makeUser()
  //   usersRepo.items.push(user)

  //   const existingProduct = makeProduct({ name: "Existing Name" })
  //   const productToEdit = makeProduct({ createdByUserId: user.id })
  //   productsRepo.items.push(existingProduct, productToEdit)

  //   const result = await sut.execute({
  //     productId: productToEdit.id.toString(),
  //     updatedByUserId: user.id.toString(),
  //     name: "Existing Name"
  //   })

  //   expect(isLeft(result)).toBeTruthy()
  //   expect(unwrapEither(result)).toBeInstanceOf(ProductAlreadyExistsError)
  // })

  // it("should return error if category does not exist", async () => {
  //   const user = makeUser()
  //   usersRepo.items.push(user)

  //   const product = makeProduct({ createdByUserId: user.id })
  //   productsRepo.items.push(product)

  //   const result = await sut.execute({
  //     productId: product.id.toString(),
  //     updatedByUserId: user.id.toString(),
  //     categoryId: "non-existing-category"
  //   })

  //   expect(isLeft(result)).toBeTruthy()
  //   expect(unwrapEither(result)).toBeInstanceOf(CategoryNotFoundError)
  // })

  // it("should update optional fields correctly", async () => {
  //   const user = makeUser()
  //   usersRepo.items.push(user)

  //   const category = makeCategory()
  //   categoryRepo.items.push(category)

  //   const product = makeProduct({ createdByUserId: user.id })
  //   productsRepo.items.push(product)

  //   const result = await sut.execute({
  //     productId: product.id.toString(),
  //     updatedByUserId: user.id.toString(),
  //     name: "Updated Name",
  //     productCode: "NEWCODE",
  //     description: "New Desc",
  //     quantity: 50,
  //     currentPrice: 100,
  //     categoryId: category.id.toString()
  //   })

  //   expect(isRight(result)).toBeTruthy()
  //   if (isRight(result)) {
  //     const updated = result.right.product
  //     expect(updated.name).toBe("Updated Name")
  //     expect(updated.productCode).toBe("NEWCODE")
  //     expect(updated.description).toBe("New Desc")
  //     expect(updated.quantity).toBe(50)
  //     expect(updated.currentPrice).toBe(100)
  //     expect(updated.categoryId.toString()).toBe(category.id.toString())
  //   }
  // })
})
