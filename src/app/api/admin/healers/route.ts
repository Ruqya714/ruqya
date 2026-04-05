import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    // Verify the requesting user is an admin
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح - يجب أن تكون مدير" }, { status: 403 });
    }

    // Parse body
    const body = await request.json();
    const {
      email,
      password,
      display_name,
      title,
      specialization,
      experience_years,
      photo_url,
    } = body;

    if (!email || !password || !display_name || !title) {
      return NextResponse.json(
        { error: "البريد الإلكتروني وكلمة المرور والاسم والمسمى الوظيفي مطلوبة" },
        { status: 400 }
      );
    }

    // Use admin client to create user (won't affect current session, no rate limits for service_role)
    const adminSupabase = createAdminClient();

    // Create auth user
    const { data: authData, error: authError } =
      await adminSupabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm so they can log in immediately
        user_metadata: { full_name: display_name },
      });

    if (authError || !authData.user) {
      return NextResponse.json(
        {
          error:
            "خطأ في إنشاء حساب المعالج: " + (authError?.message || "خطأ غير معروف"),
        },
        { status: 400 }
      );
    }

    // Update profile role to healer
    const { error: profileError } = await adminSupabase
      .from("profiles")
      .update({ role: "healer", full_name: display_name })
      .eq("id", authData.user.id);

    if (profileError) {
      // If profile update fails, try to clean up the auth user
      console.error("Error updating profile:", profileError);
    }

    // Create healer record
    const { error: healerError } = await adminSupabase
      .from("healers")
      .insert({
        profile_id: authData.user.id,
        display_name,
        title,
        specialization: specialization || null,
        experience_years: experience_years ? parseInt(experience_years) : null,
        photo_url: photo_url || null,
      });

    if (healerError) {
      // Clean up: delete the auth user if healer record creation fails
      await adminSupabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        {
          error: "خطأ في إنشاء سجل المعالج: " + healerError.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "تم إنشاء المعالج بنجاح",
      healer_id: authData.user.id,
    });
  } catch (error) {
    console.error("Unexpected error creating healer:", error);
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع" },
      { status: 500 }
    );
  }
}
