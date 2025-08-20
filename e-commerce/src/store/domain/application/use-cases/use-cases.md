
ADMIN
[] - editar usuario
[] - excluir usuário
[] - mudar usuario de customer para seller

Customer
[] - editar dados nao uniques

x --- x --- x --- x --- x --- x --- x --- x --- x --- x --- x --- x --- x --- x --- x

Category
- name
- description
- createdAt
- updatedAt

Product
- name
- productCode
- description 
- quantity
- currentPrice
- status ( active - archived )
- categoryId
- createdByUserId
- updateByUserId ( so vai atualizar quando mexer em name/quantity/price )
- createdAt 
- updatedAt
- images ( futuramente )

StockMovement
- id
- type entrada/saida
- productId 
- userID
- quantity
- reason
- createdAt

Caso de uso PRODUCTS
[x] - cadastrar produto
  - somente ao cadastrar será possivel mexer na quantidade
[x] - editar produto
[] - archivar produto
[] - ativar produto 
[] - excluir produto ( somente admin )
  


Caso de uso STOCKMOVEMENT
- dar baixa em produto
- adicionar produto