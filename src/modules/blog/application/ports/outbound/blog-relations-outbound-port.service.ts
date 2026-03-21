/**
 * Outbound port for validating blog relationships.
 *
 * Adapters implement this contract to verify the existence of related records
 * such as categories, authors, and tags before a blog use case is executed.
 */
export abstract class BlogRelationsOutboundPortService {
  /**
   * Check whether a category exists.
   * @param categoryId Category identifier
   * @returns true when the category exists
   */
  abstract categoryExists(categoryId: string): Promise<boolean>;

  /**
   * Check whether an admin author exists.
   * @param authorId Admin identifier
   * @returns true when the author exists
   */
  abstract authorExists(authorId: string): Promise<boolean>;

  /**
   * Count how many tag identifiers currently exist.
   * @param tagIds Tag identifiers to validate
   * @returns number of matching tag records
   */
  abstract countExistingTags(tagIds: string[]): Promise<number>;
}
