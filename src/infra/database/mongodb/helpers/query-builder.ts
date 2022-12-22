type QueryBuilderObject = Record<string, any>

export class QueryBuilder {
  private readonly _query: QueryBuilderObject[] = []

  private addStep (step: string, data: QueryBuilderObject): QueryBuilder {
    this._query.push({
      [step]: data
    })

    return this
  }

  match (data: QueryBuilderObject): QueryBuilder {
    return this.addStep('$match', data)
  }

  group (data: QueryBuilderObject): QueryBuilder {
    return this.addStep('$group', data)
  }

  sort (data: object): QueryBuilder {
    return this.addStep('$sort', data)
  }

  unwind (data: QueryBuilderObject): QueryBuilder {
    return this.addStep('$unwind', data)
  }

  lookup (data: QueryBuilderObject): QueryBuilder {
    return this.addStep('$lookup', data)
  }

  project (data: QueryBuilderObject): QueryBuilder {
    return this.addStep('$project', data)
  }

  build (): QueryBuilderObject[] {
    return this._query
  }
}
