export async function onRequest(context) {
  const id = context.params.id;
  const link = await context.env.TAPREVIEW.get(id);

  if (!link) {
    return new Response("Card not found", { status: 404 });
  }

  return Response.redirect(link, 302);
}
