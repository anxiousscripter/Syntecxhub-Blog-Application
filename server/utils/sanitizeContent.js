import sanitizeHtml from 'sanitize-html';

const sanitizeContent = (content) => {
	return sanitizeHtml(content, {
		allowedTags: [
			'p',
			'br',
			'h1',
			'h2',
			'h3',
			'strong',
			'b',
			'em',
			'i',
			'u',
			's',
			'blockquote',
			'ul',
			'ol',
			'li',
			'a',
			'pre',
			'code',
			'hr',
		],
		allowedAttributes: {
			a: ['href', 'target', 'rel'],
		},
		allowedSchemes: ['http', 'https', 'mailto'],
		transformTags: {
			a: sanitizeHtml.simpleTransform(
				'a',
				{
					rel: 'noopener noreferrer',
					target: '_blank',
				},
				true,
			),
		},
	});
};

export default sanitizeContent;
