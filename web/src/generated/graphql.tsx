import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Query = {
  __typename?: 'Query';
  products: PaginatedProducts;
  myProducts: Array<Product>;
  product?: Maybe<Product>;
  orders: PaginatedOrders;
  order?: Maybe<Order>;
  orders7days: Array<CountOrders>;
  users: Array<User>;
  user?: Maybe<User>;
  me?: Maybe<User>;
};


export type QueryProductsArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryProductArgs = {
  id: Scalars['Int'];
};


export type QueryOrdersArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryOrderArgs = {
  id: Scalars['Int'];
};


export type QueryUserArgs = {
  id: Scalars['Int'];
};

export type PaginatedProducts = {
  __typename?: 'PaginatedProducts';
  products: Array<Product>;
  hasMore: Scalars['Boolean'];
};

export type Product = {
  __typename?: 'Product';
  id: Scalars['Int'];
  userId: Scalars['Float'];
  user: User;
  name: Scalars['String'];
  price: Price;
  ordprods: OrderProduct;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  deletedAt?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  email: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  deletedAt: Scalars['String'];
};

export type Price = {
  __typename?: 'Price';
  id: Scalars['Float'];
  productId: Scalars['Float'];
  product: Product;
  cost: Scalars['Float'];
  selling: Scalars['Float'];
  createdAt: Scalars['String'];
};

export type OrderProduct = {
  __typename?: 'OrderProduct';
  orderId: Scalars['Float'];
  order: Order;
  productId: Scalars['Float'];
  product: Product;
  quantity: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  deletedAt?: Maybe<Scalars['String']>;
};

export type Order = {
  __typename?: 'Order';
  id: Scalars['Int'];
  socialId: Scalars['Float'];
  social: SocialMedia;
  postalId: Scalars['Float'];
  postal: PostalService;
  userId: Scalars['Int'];
  user: User;
  ordprods: OrderProduct;
  customerAcc?: Maybe<Scalars['String']>;
  chatroomId?: Maybe<Scalars['String']>;
  trackingNumber: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  deletedAt?: Maybe<Scalars['String']>;
  product: Array<Product>;
};

export type SocialMedia = {
  __typename?: 'SocialMedia';
  id: Scalars['Int'];
  name: Scalars['String'];
  orders: Array<Order>;
  iconPath?: Maybe<Scalars['String']>;
};

export type PostalService = {
  __typename?: 'PostalService';
  id: Scalars['Int'];
  name: Scalars['String'];
  orders: Array<Order>;
  iconPath?: Maybe<Scalars['String']>;
};

export type PaginatedOrders = {
  __typename?: 'PaginatedOrders';
  orders: Array<Order>;
  hasMore: Scalars['Boolean'];
};

export type CountOrders = {
  __typename?: 'CountOrders';
  date: Scalars['DateTime'];
  count: Scalars['Int'];
};


export type Mutation = {
  __typename?: 'Mutation';
  createProduct: Product;
  updateProduct?: Maybe<Product>;
  deleteProduct: Scalars['Boolean'];
  createOrder: Order;
  updateOrder?: Maybe<Order>;
  deleteOrder: Scalars['Boolean'];
  createUser: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  changePassword: UserResponse;
};


export type MutationCreateProductArgs = {
  input: ProductInput;
};


export type MutationUpdateProductArgs = {
  input: ProductInput;
  id: Scalars['Int'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['Int'];
};


export type MutationCreateOrderArgs = {
  input: OrderInput;
};


export type MutationUpdateOrderArgs = {
  input: OrderInput;
  id: Scalars['Int'];
};


export type MutationDeleteOrderArgs = {
  id: Scalars['Int'];
};


export type MutationCreateUserArgs = {
  options: EmailPasswordInput;
};


export type MutationLoginArgs = {
  options: EmailPasswordInput;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  token: Scalars['String'];
  newPassword: Scalars['String'];
};

export type ProductInput = {
  name: Scalars['String'];
  cost: Scalars['Float'];
  selling: Scalars['Float'];
};

export type OrderInput = {
  trackingNumber: Scalars['String'];
  socialId: Scalars['Int'];
  postalId: Scalars['Int'];
  productIds: Array<Scalars['Int']>;
  productQtys: Array<Scalars['Int']>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type EmailPasswordInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type RegularErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'email'>
);

export type RegularUserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & RegularErrorFragment
  )>>, user?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type CreateOrderMutationVariables = Exact<{
  input: OrderInput;
}>;


export type CreateOrderMutation = (
  { __typename?: 'Mutation' }
  & { createOrder: (
    { __typename?: 'Order' }
    & Pick<Order, 'id' | 'customerAcc' | 'chatroomId' | 'createdAt' | 'updatedAt'>
  ) }
);

export type CreateProductMutationVariables = Exact<{
  input: ProductInput;
}>;


export type CreateProductMutation = (
  { __typename?: 'Mutation' }
  & { createProduct: (
    { __typename?: 'Product' }
    & Pick<Product, 'id' | 'name' | 'createdAt' | 'updatedAt'>
  ) }
);

export type DeleteOrderMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteOrderMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteOrder'>
);

export type DeleteProductMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteProductMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteProduct'>
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LoginMutationVariables = Exact<{
  options: EmailPasswordInput;
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type CreateUserMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type CreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type UpdateOrderMutationVariables = Exact<{
  id: Scalars['Int'];
  input: OrderInput;
}>;


export type UpdateOrderMutation = (
  { __typename?: 'Mutation' }
  & { updateOrder?: Maybe<(
    { __typename?: 'Order' }
    & Pick<Order, 'id' | 'customerAcc' | 'chatroomId' | 'createdAt' | 'updatedAt'>
  )> }
);

export type UpdateProductMutationVariables = Exact<{
  id: Scalars['Int'];
  input: ProductInput;
}>;


export type UpdateProductMutation = (
  { __typename?: 'Mutation' }
  & { updateProduct?: Maybe<(
    { __typename?: 'Product' }
    & Pick<Product, 'id' | 'name' | 'createdAt' | 'updatedAt'>
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type MyProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyProductsQuery = (
  { __typename?: 'Query' }
  & { myProducts: Array<(
    { __typename?: 'Product' }
    & Pick<Product, 'id' | 'name'>
  )> }
);

export type OrderQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type OrderQuery = (
  { __typename?: 'Query' }
  & { order?: Maybe<(
    { __typename?: 'Order' }
    & Pick<Order, 'id' | 'trackingNumber' | 'customerAcc' | 'chatroomId' | 'socialId' | 'postalId'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'email'>
    ) }
  )> }
);

export type OrdersQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type OrdersQuery = (
  { __typename?: 'Query' }
  & { orders: (
    { __typename?: 'PaginatedOrders' }
    & Pick<PaginatedOrders, 'hasMore'>
    & { orders: Array<(
      { __typename?: 'Order' }
      & Pick<Order, 'id' | 'trackingNumber' | 'customerAcc' | 'chatroomId' | 'socialId' | 'postalId' | 'createdAt' | 'updatedAt'>
    )> }
  ) }
);

export type Orders7daysQueryVariables = Exact<{ [key: string]: never; }>;


export type Orders7daysQuery = (
  { __typename?: 'Query' }
  & { orders7days: Array<(
    { __typename?: 'CountOrders' }
    & Pick<CountOrders, 'date' | 'count'>
  )> }
);

export type ProductQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ProductQuery = (
  { __typename?: 'Query' }
  & { product?: Maybe<(
    { __typename?: 'Product' }
    & Pick<Product, 'id' | 'name'>
    & { price: (
      { __typename?: 'Price' }
      & Pick<Price, 'id' | 'cost' | 'selling'>
    ) }
  )> }
);

export type ProductsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type ProductsQuery = (
  { __typename?: 'Query' }
  & { products: (
    { __typename?: 'PaginatedProducts' }
    & Pick<PaginatedProducts, 'hasMore'>
    & { products: Array<(
      { __typename?: 'Product' }
      & Pick<Product, 'id' | 'name' | 'createdAt'>
      & { price: (
        { __typename?: 'Price' }
        & Pick<Price, 'id' | 'cost' | 'selling'>
      ) }
    )> }
  ) }
);

export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  email
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreateOrderDocument = gql`
    mutation CreateOrder($input: OrderInput!) {
  createOrder(input: $input) {
    id
    customerAcc
    chatroomId
    createdAt
    updatedAt
  }
}
    `;

export function useCreateOrderMutation() {
  return Urql.useMutation<CreateOrderMutation, CreateOrderMutationVariables>(CreateOrderDocument);
};
export const CreateProductDocument = gql`
    mutation CreateProduct($input: ProductInput!) {
  createProduct(input: $input) {
    id
    name
    createdAt
    updatedAt
  }
}
    `;

export function useCreateProductMutation() {
  return Urql.useMutation<CreateProductMutation, CreateProductMutationVariables>(CreateProductDocument);
};
export const DeleteOrderDocument = gql`
    mutation DeleteOrder($id: Int!) {
  deleteOrder(id: $id)
}
    `;

export function useDeleteOrderMutation() {
  return Urql.useMutation<DeleteOrderMutation, DeleteOrderMutationVariables>(DeleteOrderDocument);
};
export const DeleteProductDocument = gql`
    mutation DeleteProduct($id: Int!) {
  deleteProduct(id: $id)
}
    `;

export function useDeleteProductMutation() {
  return Urql.useMutation<DeleteProductMutation, DeleteProductMutationVariables>(DeleteProductDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($options: EmailPasswordInput!) {
  login(options: $options) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const CreateUserDocument = gql`
    mutation CreateUser($email: String!, $password: String!) {
  createUser(options: {email: $email, password: $password}) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useCreateUserMutation() {
  return Urql.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument);
};
export const UpdateOrderDocument = gql`
    mutation UpdateOrder($id: Int!, $input: OrderInput!) {
  updateOrder(id: $id, input: $input) {
    id
    customerAcc
    chatroomId
    createdAt
    updatedAt
  }
}
    `;

export function useUpdateOrderMutation() {
  return Urql.useMutation<UpdateOrderMutation, UpdateOrderMutationVariables>(UpdateOrderDocument);
};
export const UpdateProductDocument = gql`
    mutation UpdateProduct($id: Int!, $input: ProductInput!) {
  updateProduct(id: $id, input: $input) {
    id
    name
    createdAt
    updatedAt
  }
}
    `;

export function useUpdateProductMutation() {
  return Urql.useMutation<UpdateProductMutation, UpdateProductMutationVariables>(UpdateProductDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const MyProductsDocument = gql`
    query MyProducts {
  myProducts {
    id
    name
  }
}
    `;

export function useMyProductsQuery(options: Omit<Urql.UseQueryArgs<MyProductsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyProductsQuery>({ query: MyProductsDocument, ...options });
};
export const OrderDocument = gql`
    query Order($id: Int!) {
  order(id: $id) {
    id
    trackingNumber
    customerAcc
    chatroomId
    socialId
    postalId
    user {
      id
      email
    }
  }
}
    `;

export function useOrderQuery(options: Omit<Urql.UseQueryArgs<OrderQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<OrderQuery>({ query: OrderDocument, ...options });
};
export const OrdersDocument = gql`
    query Orders($limit: Int!, $cursor: String) {
  orders(limit: $limit, cursor: $cursor) {
    hasMore
    orders {
      id
      trackingNumber
      customerAcc
      chatroomId
      socialId
      postalId
      createdAt
      updatedAt
    }
  }
}
    `;

export function useOrdersQuery(options: Omit<Urql.UseQueryArgs<OrdersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<OrdersQuery>({ query: OrdersDocument, ...options });
};
export const Orders7daysDocument = gql`
    query Orders7days {
  orders7days {
    date
    count
  }
}
    `;

export function useOrders7daysQuery(options: Omit<Urql.UseQueryArgs<Orders7daysQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<Orders7daysQuery>({ query: Orders7daysDocument, ...options });
};
export const ProductDocument = gql`
    query Product($id: Int!) {
  product(id: $id) {
    id
    name
    price {
      id
      cost
      selling
    }
  }
}
    `;

export function useProductQuery(options: Omit<Urql.UseQueryArgs<ProductQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ProductQuery>({ query: ProductDocument, ...options });
};
export const ProductsDocument = gql`
    query Products($limit: Int!, $cursor: String) {
  products(limit: $limit, cursor: $cursor) {
    hasMore
    products {
      id
      name
      createdAt
      price {
        id
        cost
        selling
      }
    }
  }
}
    `;

export function useProductsQuery(options: Omit<Urql.UseQueryArgs<ProductsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ProductsQuery>({ query: ProductsDocument, ...options });
};