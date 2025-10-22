
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const formSchema = z.object({
  companyName: z.string().min(1, "Nama perusahaan tidak boleh kosong"),
  industry: z.string().min(1, "Bidang industri tidak boleh kosong"),
  website: z.string().url("URL tidak valid").optional().or(z.literal('')),
  contactName: z.string().min(1, "Nama kontak tidak boleh kosong"),
  position: z.string().min(1, "Jabatan tidak boleh kosong"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().min(1, "Nomor telepon tidak boleh kosong"),
  sponsorshipPackage: z.enum(["Platinum", "Gold", "Silver", "In-kind"]),
  supportType: z.string().min(1, "Bentuk dukungan tidak boleh kosong"),
  goals: z.string().optional(),
  logo: z.any().optional(),
  notes: z.string().optional(),
  agreement: z.boolean().refine((val) => val === true, {
    message: "Anda harus menyetujui persyaratan.",
  }),
});

export default function SponsorshipForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      industry: "",
      website: "",
      contactName: "",
      position: "",
      email: "",
      phone: "",
      sponsorshipPackage: undefined,
      supportType: "",
      goals: "",
      notes: "",
      agreement: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Formulir Terkirim!",
      description: "Terima kasih telah mendaftar menjadi sponsor. Tim kami akan segera menghubungi Anda.",
    });
    form.reset();
  }

  return (
    <section id="sponsorship-form" className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-bold font-headline">
              Become a Sponsor
            </CardTitle>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Fill out the form below to express your interest in sponsoring Bandung DevFest 2025.
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Perusahaan / Organisasi</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: PT Teknologi Maju" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bidang Industri</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: Teknologi Informasi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website / Media Sosial</FormLabel>
                      <FormControl>
                        <Input placeholder="https://contoh.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Kontak Person</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama Anda" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jabatan / Posisi</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: Marketing Manager" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@contoh.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Telepon</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="08123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="sponsorshipPackage"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Paket Sponsorship yang Diminati</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih paket" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="Platinum">Platinum</SelectItem>
                            <SelectItem value="Gold">Gold</SelectItem>
                            <SelectItem value="Silver">Silver</SelectItem>
                            <SelectItem value="In-kind">In-kind</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="supportType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Bentuk Dukungan</FormLabel>
                        <FormControl>
                            <Input placeholder="Dana / Merchandise / Teknologi / Lainnya" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name="goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tujuan atau Harapan Sponsorship</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Apa yang Anda harapkan dari sponsorship ini?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Logo / Proposal (opsional)</FormLabel>
                      <FormControl>
                        <Input type="file" {...form.register('logo')} />
                      </FormControl>
                      <FormDescription>
                        Unggah logo perusahaan atau proposal Anda dalam format PNG, JPG, atau PDF.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catatan Tambahan</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ada informasi lain yang ingin Anda sampaikan?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agreement"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Saya setuju dengan syarat dan ketentuan yang berlaku.
                        </FormLabel>
                        <FormDescription>
                          Dengan mengirimkan form ini, Anda menyetujui untuk dihubungi oleh tim Bandung DevFest.
                        </FormDescription>
                         <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="w-full">
                  Kirim Form Pendaftaran
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

