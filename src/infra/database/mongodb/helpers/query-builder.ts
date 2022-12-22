type QueryBuilderObject = Record<string, any>

export class QueryBuilder {
  private readonly _query: QueryBuilderObject[] = []

  match (data: QueryBuilderObject): QueryBuilder {
    this._query.push({
      $match: data
    })

    return this
  }

  group (data: QueryBuilderObject): QueryBuilder {
    this._query.push({
      $group: data
    })

    return this
  }

  sort (data: object): QueryBuilder {
    this._query.push({
      $sort: data
    })
    return this
  }

  unwind (data: QueryBuilderObject): QueryBuilder {
    this._query.push({
      $unwind: data
    })

    return this
  }

  lookup (data: QueryBuilderObject): QueryBuilder {
    this._query.push({
      $lookup: data
    })

    return this
  }

  project (data: QueryBuilderObject): QueryBuilder {
    this._query.push({
      $project: data
    })

    return this
  }

  build (): QueryBuilderObject[] {
    return this._query
  }
}
