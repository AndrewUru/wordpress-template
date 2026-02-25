# Webhook revalidate example

Endpoint:

- `POST /api/revalidate`
- Secret in header `x-revalidate-secret` or query `?secret=`

Payload:

```json
{
  "tag": "wp:posts",
  "path": "/blog"
}
```

`curl`:

```bash
curl -X POST "https://your-domain.com/api/revalidate" \
  -H "content-type: application/json" \
  -H "x-revalidate-secret: YOUR_SECRET" \
  -d '{"tag":"wp:posts","path":"/blog"}'
```

WordPress webhook plugins can call this endpoint after post/page/product updates.
