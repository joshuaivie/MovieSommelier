import DetailsModal from '../components/modal';

describe('Details Modal', () => {
  const modal = new DetailsModal();
  const countCommentsSpy = jest.spyOn(modal, 'countComments');

  const getComments = jest.fn(() => [
    {
      username: 'Joshua Ivie',
      comment: 'This is a test comment',
      creation_date: '2022-03-12',
    },
    {
      username: 'Joshua Ivie',
      comment: 'This is another test comment',
      creation_date: '2022-03-12',
    },
  ]);

  describe('.countComments', () => {
    test('must be a function', () => {
      expect(typeof modal.countComments).toBe('function');
    });

    test('expects comments list to be an array', () => {
      expect(modal.countComments).toThrow(Error);
      expect(modal.countComments).toThrow('Expected comment list to be an array');
    });

    test('counts the number of comments', () => {
      const comments = getComments();
      const result = modal.countComments(comments);

      expect(countCommentsSpy).toHaveBeenCalledWith(comments);
      expect(result).toBe(2);

      countCommentsSpy.mockClear();
    });
  });
});