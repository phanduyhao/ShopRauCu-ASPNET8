using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ShopRauCu.Filters
{
    public class AdminAuthorizeAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var role = context.HttpContext.Session.GetString("UserRole");

            if (string.IsNullOrEmpty(role) || role != "Admin")
            {
                context.Result = new RedirectToActionResult(
                    actionName: "Index",
                    controllerName: "Home",
                    routeValues: new { area = "" }  // quan trọng: bỏ area
                );
            }


            base.OnActionExecuting(context);
        }
    }
}
